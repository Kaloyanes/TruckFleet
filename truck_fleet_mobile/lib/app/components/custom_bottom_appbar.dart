import 'package:flutter/material.dart';

class CustomBottomAppbarItem {
  const CustomBottomAppbarItem({required this.icon, required this.label, this.onPressed});

  final IconData icon;
  final String label;
  final Function()? onPressed;
}

class CustomBottomAppbar extends StatelessWidget {
  const CustomBottomAppbar({super.key, this.actions});

  final List<CustomBottomAppbarItem>? actions;

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: Theme.of(context).copyWith(
        iconButtonTheme: IconButtonThemeData(
          style: Theme.of(context).iconButtonTheme.style!.copyWith(
                side: const WidgetStatePropertyAll(
                  BorderSide.none,
                ),
              ),
        ),
      ),
      child: BottomAppBar(
        height: 80,
        child: Row(
          mainAxisAlignment: actions!.length > 1 ? MainAxisAlignment.spaceAround : MainAxisAlignment.start,
          children: actions!.map((action) {
            return IconButton(
              icon: Icon(action.icon),
              onPressed: action.onPressed,
            );
          }).toList(),
        ),
      ),
    );
  }
}
